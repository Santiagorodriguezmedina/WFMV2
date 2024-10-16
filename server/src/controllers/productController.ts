import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request,res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (req: Request,res: Response): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity ,description} = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
        description,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};


export const deleteProduct = async (req: Request,res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId, 10);

  try {
    await prisma.products.delete({
      where: { productId: productId }, // Use productId as the unique identifier
    });

    res.status(204).send();
  } catch (error) {
    const prismaError = error as { code?: string }; // Assert the error type

    if (prismaError.code === 'P2025') { // Check for the specific error code
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
};


