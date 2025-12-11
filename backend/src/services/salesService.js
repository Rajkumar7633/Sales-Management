import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sales from '../models/Sales.js';

// Load environment variables
dotenv.config();

// MongoDB is optional - only use if MONGODB_URI is provided
const hasMongoDB = !!process.env.MONGODB_URI;

if (!hasMongoDB) {
  console.log('ℹ️  MONGODB_URI not set - MongoDB features will be disabled. Using MySQL instead.');
}

class SalesService {
  constructor() {
    // Only connect to MongoDB if MONGODB_URI is provided
    if (hasMongoDB && mongoose.connection.readyState !== 1) {
      mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }).catch(err => {
        console.error('MongoDB connection error:', err.message);
      });
    }
  }

  async getFilteredSales({
    search = '',
    page = 1,
    sortBy = 'date',
    sortOrder = 'desc',
    regions = [],
    categories = [],
    paymentMethods = [],
    startDate,
    endDate,
    minAmount,
    maxAmount,
    limit = 10
  }) {
    // If MongoDB is not configured, throw error to indicate MySQL should be used
    if (!hasMongoDB) {
      throw new Error('MongoDB not configured. Please use MySQL-based endpoints.');
    }
    
    try {
      const query = {};

      // Search functionality
      if (search) {
        query.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { productName: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by regions
      if (regions.length > 0) {
        query.region = { $in: regions };
      }

      // Filter by categories
      if (categories.length > 0) {
        query.category = { $in: categories };
      }

      // Filter by payment methods
      if (paymentMethods.length > 0) {
        query.paymentMethod = { $in: paymentMethods };
      }

      // Date range filter
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      // Amount range filter
      if (minAmount !== undefined || maxAmount !== undefined) {
        query.total = {};
        if (minAmount !== undefined) query.total.$gte = Number(minAmount);
        if (maxAmount !== undefined) query.total.$lte = Number(maxAmount);
      }

      // Sorting
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const [data, total] = await Promise.all([
        Sales.find(query)
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Sales.countDocuments(query)
      ]);

      // Calculate aggregations
      const aggregations = await Sales.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
            totalItems: { $sum: '$quantity' },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ]);

      return {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        },
        aggregations: aggregations[0] || {
          totalSales: 0,
          totalItems: 0,
          avgOrderValue: 0
        }
      };
    } catch (error) {
      console.error('Error in getFilteredSales:', error);
      throw error;
    }
  }

  async getFilterOptions() {
    // If MongoDB is not configured, throw error to indicate MySQL should be used
    if (!hasMongoDB) {
      throw new Error('MongoDB not configured. Please use MySQL-based endpoints.');
    }
    
    try {
      const [regions, categories, paymentMethods] = await Promise.all([
        Sales.distinct('region'),
        Sales.distinct('category'),
        Sales.distinct('paymentMethod')
      ]);

      return {
        regions: regions.filter(Boolean).sort(),
        categories: categories.filter(Boolean).sort(),
        paymentMethods: paymentMethods.filter(Boolean).sort()
      };
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      throw error;
    }
  }

  async getSalesData() {
    // If MongoDB is not configured, throw error to indicate MySQL should be used
    if (!hasMongoDB) {
      throw new Error('MongoDB not configured. Please use MySQL-based endpoints.');
    }
    
    try {
      return await Sales.find().limit(100).lean();
    } catch (error) {
      console.error('Error in getSalesData:', error);
      throw error;
    }
  }
}

// Export as a singleton
export default new SalesService();