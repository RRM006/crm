import { Router } from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantMiddleware, staffOrAdmin } from '../middleware/tenant.middleware';
import {
  createCustomerValidator,
  updateCustomerValidator,
  idParamValidator,
  paginationValidator
} from '../validators/crm.validator';
import { validate } from '../validators/validate';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', paginationValidator, validate, getCustomers);
router.get('/:id', idParamValidator, validate, getCustomer);
router.post('/', staffOrAdmin, createCustomerValidator, validate, createCustomer);
router.put('/:id', staffOrAdmin, updateCustomerValidator, validate, updateCustomer);
router.delete('/:id', staffOrAdmin, idParamValidator, validate, deleteCustomer);

export default router;

