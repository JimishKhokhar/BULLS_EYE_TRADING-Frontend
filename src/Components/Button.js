import React from 'react'
import { Link } from 'react-router-dom'
import CredButton from './CredButton'

const Button = (props) => {
    return (
        <div className='flex justify-center'>
            
            <Link to={props.GoTo}>
                <div className="w-fit ">
                <CredButton  Title={props.Title}/>
                    {/* <button className="text-3xl py-3 px-8 text-black transition-all duration-500  font-bold hover:scale-110 ">{props.Title}</button> */}
                </div>
            </Link>
        </div>
    )
}

export default Button