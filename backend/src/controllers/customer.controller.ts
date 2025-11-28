import { Response } from 'express';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../types';
import { Role } from '@prisma/client';

export const getCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.companyId) {
      res.status(400).json({ success: false, message: 'Company ID required' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

    const where: any = {
      companyId: req.companyId
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: { id: true, name: true, avatar: true }
          },
          _count: {
            select: { leads: true, contacts: true, tasks: true }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers'
    });
  }
};

export const getCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.companyId) {
      res.status(400).json({ success: false, message: 'Company ID required' });
      return;
    }

    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        companyId: req.companyId
      },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true }
        },
        leads: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        contacts: {
          take: 5,
          orderBy: { isPrimary: 'desc' }
        },
        tasks: {
          where: { status: { not: 'COMPLETED' } },
          take: 5,
          orderBy: { dueDate: 'asc' }
        },
        customerNotes: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { customer }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer'
    });
  }
};

export const createCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.companyId) {
      res.status(400).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, email, phone, company, address, city, country, status, notes, avatar } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        address,
        city,
        country,
        status: status || 'ACTIVE',
        notes,
        avatar,
        companyId: req.companyId,
        createdById: req.user.id
      },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'CUSTOMER_CREATED',
        title: `Customer "${name}" created`,
        customerId: customer.id,
        companyId: req.companyId,
        createdById: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { customer }
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer'
    });
  }
};

export const updateCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.companyId) {
      res.status(400).json({ success: false, message: 'Company ID required' });
      return;
    }

    const { id } = req.params;

    // Check if customer exists and belongs to company
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    const { name, email, phone, company, address, city, country, status, notes, avatar, totalSpent } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(avatar !== undefined && { avatar }),
        ...(totalSpent !== undefined && { totalSpent })
      },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: { customer }
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer'
    });
  }
};

export const deleteCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.companyId) {
      res.status(400).json({ success: false, message: 'Company ID required' });
      return;
    }

    // Only admin/staff can delete
    if (req.userRole === Role.CUSTOMER) {
      res.status(403).json({
        success: false,
        message: 'Customers cannot delete records'
      });
      return;
    }

    const { id } = req.params;

    // Check if customer exists and belongs to company
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    await prisma.customer.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer'
    });
  }
};

