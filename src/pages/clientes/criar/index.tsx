import { Input } from '@/components/Input'
import { InputCallback } from '@/components/InputCallback'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const DEFAULT_MESSAGE_RULE = "Campo obrigatório."

const regras = z.object({
        nome: z.string().min(1, DEFAULT_MESSAGE_RULE),
        email: z.email(DEFAULT_MESSAGE_RULE),
        // cpfcnpj: z.string().min(1, DEFAULT_MESSAGE_RULE).max(14, "Limite de 14 caracteres"),
        // sexo: z.string().min(1, DEFAULT_MESSAGE_RULE).max(1, "Limite de 1 caracteres."),
        cep: z.string().min(1, DEFAULT_MESSAGE_RULE).max(9, "Cep inválido."),
        // rua: z.string().min(1, DEFAULT_MESSAGE_RULE),
        // bairro: z.string().min(1, DEFAULT_MESSAGE_RULE),
        // cidade: z.string().min(1, DEFAULT_MESSAGE_RULE),
        // estado: z.string().min(1, DEFAULT_MESSAGE_RULE),
        // numero: z.string().min(1, DEFAULT_MESSAGE_RULE),
        // complemento: z.string().min(1, DEFAULT_MESSAGE_RULE),
    })

    export type FormType = z.infer<typeof regras>

export default function CadastrarClientes() {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormType>({
        resolver: zodResolver(regras)
    })

    function onSubmit(data: FormType){
        // console.log('DATA DENTRO DO ONSUBMIT', data)
    }
    // console.log('Error', errors)

    async function buscaCep(){
        const busca = await fetch('https://viacep.com.br/ws/36770066/json/')
        const response = await busca.json()
        console.log('response', response)
    }

    // xs > 12 colunas
    // sm > 6 colunas
    // md > qtd recebida por propriedade

    return(
        <>
            <h1 className='text-center'>Cadastrar Clientes</h1>
            <div className='w-full flex items-center justify-center'>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className='grid grid-cols-12 space-y-6 space-x-2'>
                    <Input 
                        errors={errors}
                        label='Nome'
                        name='nome'
                        register={register}
                        required
                        size={8}
                    />
                    <Input 
                        errors={errors}
                        label='Email'
                        name='email'
                        register={register}
                        required
                        size={4}
                    />
                    <InputCallback
                        errors={errors}
                        label='Cep'
                        name='cep'
                        register={register}
                        required
                        size={12}
                        funcaoParaSerMostrada={buscaCep}
                    />
                    <button className='mt-10'>Enviar</button>
                </form>
            </div>
        </>
    )
}