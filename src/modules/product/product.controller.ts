import { Request, Response, RequestHandler } from 'express'
import { ProductService } from './product.service'
import { AuthenticatedRequest } from '@middleware/auth'


export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id
        const { title, description, price, category } = req.body

        const images = (req.files as Express.Multer.File[]).map(file => file.path)
        const video = (req.file as Express.Multer.File)?.path

        const product = await ProductService.create(userId, {
            title, 
            description, 
            price: parseFloat(price), 
            category,
            images, 
            video
        })

        res.status(200).json(product)
    } catch (err: any) {
        res.status(400).json({ message: err.message })
    }
}

export const getAllProducts = async (_req: Request, res: Response) => {
    const products = await ProductService.getAll()
    res.json(products)
}

export const getProductById = async (req:Request, res: Response) => {
    const product = await ProductService.getById(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return //ts route handler must retrun either void or promise<void>
    }
    res.json(product);
  }

/*export const getProductById: RequestHandler = async (req, res) => {
  const product = await ProductService.getById(req.params.id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return
  }
  res.json(product);
};*/

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const updated = await ProductService.update(req.params.id, req.user!.id, req.body)
        res.json(updated)
    } catch (err: any) {
        res.status(403).json({ message: err.message })
    }
} 

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const deleted = await ProductService.delete(req.params.id, req.user!.id)
        res.json('Product deleted')
    } catch (err: any) {
        res.status(403).json({ message: err.message })

    }
}