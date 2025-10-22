import { useState, useEffect } from "react";

function Erwin(props){
	return (
		<div id='modal'>
			<div id='modal-el' className = {props.closing ? 'modal-out error' : "error"}>
				<h3>Ошибка<span id='closebutton' onClick={() => {props.closemodal()}}>×</span></h3>
				<p>{props.text}</p>
			</div>
		</div>
	)
}

export default Erwin;