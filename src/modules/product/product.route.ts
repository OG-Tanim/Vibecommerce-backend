import { Router } from 'express'
import { authenticate } from '@middleware/auth'
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from './product.controller'

import { imageUpload, videoUpload } from '@utils/cloudinary-upload'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)

router.post('/',
    authenticate, 
    imageUpload.array('images', 5), //stores images and paths to req.files
    videoUpload.single('video'),  //stores video and path to req.file
) //functions are called one after the other like a pipeline (next functions)

router.patch('/:id', 
    authenticate,
    imageUpload.array('image', 5),
    videoUpload.single('video'),
    updateProduct)
    
router.delete('/:id', authenticate, deleteProduct)

export default router