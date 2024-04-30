import style from './index.module.css';

export const Loading = () => {
  return (
    <div className={style.animation}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
