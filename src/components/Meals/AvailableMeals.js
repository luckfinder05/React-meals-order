import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import useHttp from '../../hooks/use-http';
import { useContext, useEffect, useState } from 'react';
import CartContext from '../../store/cart-context';

const AvailableMeals = () => {
  const [loadedMeals, setMeals] = useState([]);
  const { error, isLoading, sendRequest: fetchMeals } = useHttp();
  const { sendRequest: fetchCart } = useHttp();
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


  useEffect(() => {
    const transformCartItems = cartObj => {
      const cartId = 'cart';
      const loadedMeals = cartObj[cartId];
      cartCtx.addList(loadedMeals);
    };
    fetchCart({
      url: 'https://react-http-4bdc6-default-rtdb.firebaseio.com/cart.json',
    }, transformCartItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
