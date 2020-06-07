import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css'
import {FiUpload} from 'react-icons/fi'


interface Props{
  onFileUpload:(file: File) => void,
}

const Dropzone: React.FC<Props> = ({onFileUpload})=> {

  const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0]
      const fileUrl = URL.createObjectURL(file)
      setImage(fileUrl)
      onFileUpload(file)
    // Do something with the files
  }, [onFileUpload])

  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: 'image/*'})
  const [image, setImage] = useState('')

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>
        {
          //imagem selecionada? se sim mostra a imagem, se não mostra o texto
          image ? 
            <img src={image} alt='thumbnail'></img> 
            : 
            ( <p>
              <FiUpload color="fff" size={20}></FiUpload>
              Arraste uma imagem ou clique para abrir o explorador de arquivos
            </p> 
            )
        }
    </div>
  )
}

export default Dropzone