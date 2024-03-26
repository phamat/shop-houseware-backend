const Product = require("../models/ProductModel")

const createProduct = async (newProduct) => {
    const { name, image, type, countInStock, price, rating, description, discount } = newProduct
    try {
        const checkProduct = await Product.findOne({ name: name })
        if (checkProduct) {
            return {
                status: 'ERR',
                message: 'The name of product is already'
            }
        }

        const createdProduct = await Product.create({
            name,
            image,
            type,
            countInStock: Number(countInStock),
            price,
            rating,
            description,
            discount: Number(discount),
        })

        if (createdProduct) {
            return {
                status: 'OK',
                message: 'SUCCESS',
                data: createdProduct
            }
        } else {
            throw new Error('Failed to create product')
        }
    } catch (error) {
        throw error
    }
}

const updateProduct = async (id, data) => {
    try {
        const checkProduct = await Product.findById(id)
        if (!checkProduct) {
            return {
                status: 'ERR',
                message: 'The product is not defined'
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
        if (!updatedProduct) {
            return {
                status: 'ERR',
                message: 'Failed to update product'
            }
        }

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: updatedProduct
        }
    } catch (error) {
        throw error
    }
}

const deleteProduct = async (id) => {
    try {
        const checkProduct = await Product.findById(id)
        if (!checkProduct) {
            return {
                status: 'ERR',
                message: 'The product is not defined'
            }
        }

        await Product.findByIdAndDelete(id)
        return {
            status: 'OK',
            message: 'Delete product success',
        }
    } catch (error) {
        throw error
    }
}

const deleteManyProduct = async (ids) => {
    try {
        const result = await Product.deleteMany({ _id: ids })
        if (result.deletedCount === 0) {
            return {
                status: 'ERR',
                message: 'No product found with the provided IDs'
            }
        }

        return {
            status: 'OK',
            message: 'Delete product success',
        }
    } catch (error) {
        throw error
    }
}

const getDetailsProduct = async (id) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            return {
                status: 'ERR',
                message: 'No product found with the provided ID'
            }
        }

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: product
        }
    } catch (error) {
        throw error
    }
}

const getAllProduct = async (limit, page, sort, filter) => {
    try {
        let query = Product.find()
        if (filter) {
            const label = filter[0]
            query = query.find({ [label]: { $regex: filter[1], $options: 'i' } })
        }
        if (sort) {
            const sortObj = {}
            sortObj[sort[1]] = sort[0]
            query = query.sort(sortObj)
        }
        const totalProduct = await Product.countDocuments(query)
        const allProduct = await query.limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 })

        return {
            status: 'OK',
            message: 'Success',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit)
        }
    } catch (error) {
        throw error
    }
}

const getAllType = async () => {
    try {
        const allType = await Product.distinct('type')
        if (!allType || allType.length === 0) {
            return {
                status: 'ERR',
                message: 'No types found'
            }
        }

        return {
            status: 'OK',
            message: 'Success',
            data: allType,
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}