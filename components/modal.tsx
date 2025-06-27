import React from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { Chilanka } from 'next/font/google'

const ModalComponent = ({isOpen, closeModal, children, heading, description}) => {

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {heading}
            </h4>
            <p className="mb-6 text-theme-xl text-gray-500 dark:text-gray-400 lg:mb-7">
              {description}
            </p>
          </div>
          {children}
        </div>
      </Modal>
  )
}

export default ModalComponent