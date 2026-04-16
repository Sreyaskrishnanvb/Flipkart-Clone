function Toast({ message, type = 'success', show }) {
  return (
    <div className={`toast ${type} ${show ? 'show' : ''}`} id="toast-notification">
      {message}
    </div>
  );
}

export default Toast;
