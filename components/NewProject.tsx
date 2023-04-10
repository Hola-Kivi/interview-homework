'use client';

import { useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

import { createNewProject } from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';

Modal.setAppElement('#modal');

const NewProject = ({ script }: any) => {
  const router = useRouter();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await createNewProject(name);

      router.refresh();
    } catch (e) {
      setError('Error...');
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  return (
    <div className="pb-8 hover:scale-105 transition-all ease-in-out duration-200 flex justify-center items-center">
      <Button onClick={() => openModal()}>{script.newProjectBTN}</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute inset-0 h-screen w-screen"
        className="w-2/4 bg-white rounded-xl p-8"
      >
        <h1 className="text-3xl mb-6">{script.newProjectMD}</h1>
        <form className="flex items-center" onSubmit={handleSubmit}>
          <Input
            placeholder={script.inputPlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" loading={isLoading}>
            {script.createBTN}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default NewProject;
