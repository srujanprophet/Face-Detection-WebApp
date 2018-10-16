import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
	const boxLoc = []
	let key = 0;
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
				{ boxes.forEach( box => {
					boxLoc.push(<div key={key++} className='bounding-box' style={{top:box.topRow, right:box.rightCol, bottom:box.bottomRow, left:box.leftCol}}></div>)
				})}
				<div>{ boxLoc }</div>	
			</div>
		</div>
	)
}

export default FaceRecognition;