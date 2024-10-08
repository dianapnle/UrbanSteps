// import React from 'react';
import { useModal } from '../../context/Modal'

function OpenModalDeleteButton({
  modalComponent, // component to render inside the modal
}) {
  const { setModalContent } = useModal()

  const onClick = () => {
    setModalContent(modalComponent)
  }

  return (
    <button className={`delete-button`} onClick={onClick}>
      Delete
    </button>
  )
}

export default OpenModalDeleteButton
