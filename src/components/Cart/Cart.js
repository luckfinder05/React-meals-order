import { useCallback, useContext, useEffect, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import useHttp from '../../hooks/use-http';
import Checkout from './Checkout';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false)
  const [isOrderSent, setIsOrderSent] = useState(false)
  const { sendRequest: cartSave } = useHttp();
  const { sendRequest: orderSave } = useHttp();


  const cartCtx = useContext(CartContext);

  const totalAmount = `$${Math.abs(cartCtx.totalAmount.toFixed(2))}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const cartSaveHandler = useCallback(async (items) => {
    cartSave({
      url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/cart.json',
      method: 'PATCH',
      body: { cart: items },
      headers: {
        'Content-Type': 'application/json',
      }
    }, () => { console.log('Cart saved to server DB') });
  }, [cartSave]);

  const orderSaveHandler = useCallback(async (order) => {
    orderSave({
      url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/order.json',
      method: 'PATCH',
      body: order,
      headers: {
        'Content-Type': 'application/json',
      }
    }, (data) => {
      setIsOrderSent(true);
      cartCtx.clearCart();
      hideOrderFormHandler();
      console.log('Order sent');
    });
  }, [orderSave, cartCtx]);

  const showOrderFormHandler = () => {
    setIsCheckout(true);
  }

  const hideOrderFormHandler = () => {
    setIsCheckout(false);
  }

  useEffect(() => {
    const timerId = setTimeout(() => { cartSaveHandler(cartCtx.items) }, 2000);
    return () => {
      clearTimeout(timerId);
    }
  }, [cartCtx.items, cartSaveHandler])

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, { ...item, amount: 1 })}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isCheckout && cartItems}
      <div className={classes.total}>
        {isOrderSent && <span>Order successfully sent</span>}
        {!isOrderSent &&
          <>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
          </>
        }
      </div>
      {isCheckout && <Checkout items={cartCtx.items} onOrderSend={orderSaveHandler} onCancel={hideOrderFormHandler} />}
      {!isCheckout &&
        <div className={classes.actions}>
          <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
          {hasItems && <button className={classes.button} onClick={showOrderFormHandler}>Order</button>}
        </div>}
    </Modal>
  );
};

export default Cart;
