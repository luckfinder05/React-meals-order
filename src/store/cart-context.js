import React from 'react';

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => { },
  removeItem: (id) => { },
  addList: (itemList) => { },
  clearCart: () => { }
});

export default CartContext;