import classes from './MainNavigation.module.css';
import Link from 'next/link'

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>VerseOnSync</div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/myAccount'>My Account</Link>
          </li>
          {/* <li>
            <Link href='/FAQ'>FAQ</Link>
          </li>
          <li>
            <Link href='/finder'>Finder</Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;