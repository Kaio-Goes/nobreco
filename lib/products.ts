import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export type Product = {
  id: string;
  nome: string;
  preco: number; // valor em reais
  descricao?: string;
  imagem: string; // caminho público, ex: /produtos/arquivo.png
  criadoEm: string; // ISO date
};

const DATA_FILE = path.join(process.cwd(), "data", "products.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "produtos");
const UPLOAD_PUBLIC_PATH = "/produtos";

async function readAll(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeAll(products: Product[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  const products = await readAll();
  return products.sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readAll();
  return products.find((p) => p.id === id);
}

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/** Salva o arquivo de imagem enviado no admin e retorna o caminho público. */
export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Formato de imagem não suportado.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Imagem muito grande (máx. 5MB).");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const extension =
    file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1];
  const filename = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `${UPLOAD_PUBLIC_PATH}/${filename}`;
}

export type CreateProductInput = {
  nome: string;
  preco: number;
  descricao?: string;
  imagem: string;
};

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const products = await readAll();

  const product: Product = {
    id: crypto.randomUUID(),
    nome: input.nome,
    preco: input.preco,
    descricao: input.descricao,
    imagem: input.imagem,
    criadoEm: new Date().toISOString(),
  };

  products.push(product);
  await writeAll(products);

  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await readAll();
  const remaining = products.filter((p) => p.id !== id);
  await writeAll(remaining);
}
