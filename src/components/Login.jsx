import { Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import validator from 'validator';
import SideDrawer from './SideDrawer';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const isPasswordValid = /^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*\d).{5,}$/.test(password) && password.length >= 1;
    const isEmailValid = validator.isEmail(email) && email.length >= 1;
    const [loading, setLoading] = useState(false)


    const toast = useToast()
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URI


    async function submitHandler() {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'Please fill all fields',
                status: 'error',
                duration: '5000',
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }
        try {
            const { data } = await axios.post(`${apiUrl}/api/user/login`, {
                email, password
            }, {
                withCredentials: true,
            })
            toast({
                title: "Loggedin Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

            localStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn))
            setLoading(false)
            navigate('/chats')
        } catch (err) {
            setTimeout(() => {
                setLoading(false)
            }, 100);    
            // console.log(err)
            toast({
                title: err.response.data.message ? err.response.data.message : err.response.data,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }

    }

    return (
        <VStack className='mt-4' spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    color='black'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    data-title="Enter the email"
                />
                <div className='error'>
                    {isEmailValid ? null : "Enter a valid email"}
                </div>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your password'
                        onChange={(e) => setPassword(e.target.value)}
                        pattern='/^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*\d).{5,}$/'
                        value={password}
                        isInvalid={!isPasswordValid}
                    />
                    <InputRightElement width={'4.5rem'}>
                        {/* <Checkbox
                            h="1.75rem"
                            className='mt-1 border-2 border-black rounded'
                            size="md"
                            onChange={() => setShow((prev) => !prev)}
                            isChecked={show}>
                        </Checkbox> */}
                        <Button bg={'transparent'} h="1.75rem" size="sm" onClick={() => setShow((prev) => !prev)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <div className='error'>
                    {isPasswordValid ? null : "Enter a strong password"}
                </div>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("Guest@1212");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
