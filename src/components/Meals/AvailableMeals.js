import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import useHttp from '../../hooks/use-http';
import { useContext, useEffect, useState } from 'react';
import CartContext from '../../store/cart-context';

const AvailableMeals = () => {
  const [loadedMeals, setMeals] = useState([]);
  const { error, isLoading, sendRequest: fetchMeals } = useHttp();
  const [isCartChanged, setIsCartChanged] = useState(false);
  const { isLoading: isCartLoading, sendRequest: fetchCart } = useHttp();
  const { sendRequest: cartSave } = useHttp();
  const cartCtx = useContext(CartContext);

  useEffect(() => {
    const transformMeals = mealsObj => {
      const loadedMeals = [];
      for (const mealKey in mealsObj) {
        loadedMeals.push(mealsObj[mealKey]);
      }
      setMeals(loadedMeals);
    };

    fetchMeals({
      url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/availableMeals.json'
    }, transformMeals);
  }, [fetchMeals]);

  //loading Cart state from DB
  useEffect(() => {
    const transformCartItems = cartObj => {
      const cartId = 'cart';
      const loadedItems = cartObj[cartId];
      cartCtx.addList(loadedItems);
      // console.log('Cart loaded from server DB')
    };
    fetchCart({
      url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/cart.json',
    }, transformCartItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //saving Cart state to DB
  useEffect(() => {
    let timerId = null;

    const cartSaveHandler = async (items) => {
      cartSave({
        url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/cart.json',
        method: 'PATCH',
        body: { cart: items },
        headers: {
          'Content-Type': 'application/json',
        }
      }, () => { /* console.log('Cart saved to server DB') */ });
    };

    const isChanged = isCartChanged && !isCartLoading;
    if (isChanged) { timerId = setTimeout(() => { cartSaveHandler(cartCtx.items) }, 2000) }
    setIsCartChanged(true);

    return () => { clearTimeout(timerId) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCtx.items])


  const mealsList = loadedMeals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {!isLoading && <ul>{mealsList}</ul>}
        {error && <p className={classes.error}>{error}</p>}
        {isLoading && <p className={classes.loading}>LOADING DATA...</p>}
      </Card>
    </section>
  );
};

export default AvailableMeals;