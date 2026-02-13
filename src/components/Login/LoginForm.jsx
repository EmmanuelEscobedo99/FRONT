import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { loginService } from '../../services/authServices'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'
import { useUser } from '../../context/UserContext'

export const LoginForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange' // Validacion en tiempo real
  })

  const { setUserInfo, userInfo } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const onSubmit = async (data) => {
    // Logueando al usuario
    const result = await loginService(data, reset, setRedirect, setUserInfo)

    if (result.succes) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  if (redirect && userInfo.isAdmin) {
    //return <Navigate to={'/admin/dashboard'}/>
  }

  if (redirect && !userInfo.isAdmin) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto'>
      <div>
        <input
          {...register('email', {
            required: 'El email es requerido',
            pattern: {
              value: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/,
              message: 'Correo electrónico inválido',
            },
            minLength: {
              value: 6,
              message: 'Mínimo 6 caracteres',
            },
            maxLength: {
              value: 254,
              message: 'Máximo de 2 caracteres',
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${errors.email
            ? 'border-red-500 outline-red-500 focus:outline-red-500'
            : ''
            }`}
          autoComplete="email"
          name="email"
          placeholder="Correo electronico"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className='relative'>
        <input
          {...register('password', {
            required: 'La contraseña es requerida [6-20 caracteres de longitud]',
            minLength: {
              value: 6,
              message: 'Mínimo 6 caracteres',
            },
            maxLength: {
              value: 254,
              message: 'Máximo de 2 caracteres',
            },
          })}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${errors.password
            ? 'border-red-500 outline-red-500 focus:outline-red-500'
            : ''
            }`}
          autoComplete="password"
          name="password"
          placeholder="Contraseña"
          type={showPassword ? 'text' : 'password'}
        />
        <button
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={
            showPassword
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
          type='button'
          className='cursor-pointer absolute right-4 top-[20px] transform -translate-y-1/2 text-gray-600'>
          {showPassword ? (<FaEyeSlash size={23} />) : (<FaEye />)}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.password.message}
          </p>
        )}
      </div>
      <button className='btn btn-primary' type='submit'>
        Iniciar sesión
      </button>

    </form>
  )
}
