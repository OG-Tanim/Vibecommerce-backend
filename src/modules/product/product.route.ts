import { Router } from 'express'
import { authenticate } from '@middleware/auth'
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from './product.controller'

import { imageUpload, videoUpload } from '@utils/upload'

const router = Router()

router.get('/', getAllProducts)
//router.get('/:id', getProductById)

router.post('/',
    authenticate, 
    imageUpload.array('images', 5),
    videoUpload.single('video'),
    createProduct
)

router.patch('/:id', authenticate, updateProduct)
router.delete('/:id', authenticate, deleteProduct)

export default router