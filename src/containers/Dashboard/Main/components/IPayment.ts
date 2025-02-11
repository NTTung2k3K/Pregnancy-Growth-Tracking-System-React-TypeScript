export interface PaymentMainDashboard {
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  userMembership: {
    user: User;
    package: Package;
  };
}

interface User {
  fullName: string;
  phoneNumber: string;
}
interface Package {
  packageName: string;
  price: string;
}
