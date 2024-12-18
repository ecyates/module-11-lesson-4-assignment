import { NavLink } from 'react-router-dom';

function NavBar(){

    return(
        <nav className='clearfix'>
            <NavLink to='/' activeClassName='active'>Home</NavLink>
            <NavLink to='/characters/' activeClassName='active'>Browse Characters</NavLink>
            <NavLink to='/comics/' activeClassName='active'>Browse Comics</NavLink>
        </nav>
    )
}

export default NavBar;