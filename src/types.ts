export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type CartItem = MenuItem & {
  qty: number;
};
