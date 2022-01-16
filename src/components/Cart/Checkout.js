import useInput from '../../hooks/use-input';
// import CartContext from '../../store/cart-context';
import classes from './Checkout.module.css';

const Checkout = (props) => {
  const [nameFields, nameHasError, nameIsValid] = useInput((text) => text.trim() !== '')
  const [streetFields, streetHasError, streetIsValid] = useInput((text) => text.trim() !== '')
  const [postalFields, postalHasError, postalIsValid] = useInput((text) => text.trim() !== '')
  const [cityFields, cityHasError, cityIsValid] = useInput((text) => text.trim() !== '')

  const nameClasses = nameHasError ? `${classes.control} ${classes.invalid}` : classes.control;
  const streetClasses = streetHasError ? `${classes.control} ${classes.invalid}` : classes.control;
  const postalClasses = postalHasError ? `${classes.control} ${classes.invalid}` : classes.control;
  const cityClasses = cityHasError ? `${classes.control} ${classes.invalid}` : classes.control;


  const isFormValid = nameIsValid && streetIsValid && postalIsValid && cityIsValid;

  const confirmHandler = (event) => {
    event.preventDefault();
    if (!isFormValid) { return }
    props.onOrderSend({
      items: { ...props.items },
      orderData: {
        name: nameFields.value,
        street: streetFields.value,
        postal: postalFields.value,
        city: cityFields.value
      }
    });
  };

  return (
    <form className={classes.form} onSubmit={confirmHandler} >
      <div className={nameClasses}>
        <label htmlFor='name'>Your Name</label>
        <input type='text' id='name' {...nameFields} />
      </div>
      <div className={streetClasses}>
        <label htmlFor='street'>Street</label>
        <input type='text' id='street' {...streetFields} />
      </div>
      <div className={postalClasses}>
        <label htmlFor='postal'>Postal Code</label>
        <input type='text' id='postal'{...postalFields} />
      </div>
      <div className={cityClasses}>
        <label htmlFor='city'>City</label>
        <input type='text' id='city' {...cityFields} />
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit} disabled={!isFormValid}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;