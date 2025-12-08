// /backend/src/services/salesService.js
import Sales from '../models/Sales.js';

class SalesService {
  async getFilteredSales(filters = {}) {
    const { page = 1, pageSize = 10, ...rest } = filters;
    const data = await Sales.getFilteredSales({ ...rest, page, limit: pageSize });
    const total = await Sales.getCount(rest);
    const metadata = await Sales.getMetadata(rest);
    
    return {
      data,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: Math.ceil(total / pageSize)
      },
      metadata
    };
  }

  async getFilterOptions() {
    return await Sales.getFilterOptions();
  }
}

export default new SalesService();