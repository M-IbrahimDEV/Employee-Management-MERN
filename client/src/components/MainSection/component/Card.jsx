// import React from 'react'
import './Card.css'
import PropTypes from 'prop-types';

const Card = ({ empData }) => {
    return (
        <div className="card-container">
            <img src={empData.image} alt="Employee" className="card-image" />
            <div className="card-info">
                <h3>{empData.firstname} {empData.lastname}</h3>
                <p>{empData.job}</p>
            </div>
        </div>
    )
}


Card.propTypes = {
    empData: PropTypes.object.isRequired,
};

export default Card
