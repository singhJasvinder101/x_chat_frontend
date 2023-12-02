import { Button, Checkbox, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import validator from 'validator';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [show, setShow] = useState(false)
    const [cnfrmShow, setCnfrmShow] = useState(false)
    const navigate = useNavigate()

    // in onsubmit
    const isPasswordValid = /^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*\d).{5,}$/.test(password) && password.length >= 1;
    const isEmailValid = validator.isEmail(email) && email.length >= 1;
    const [isNameValid, setisNameValid] = useState(true)

    const [passwordMatchState, setPasswordsMatchState] = useState(false)
    const [picLoading, setPicLoading] = useState(false)
    const [pic, setPic] = useState()
    const apiUrl = import.meta.env.VITE_API_URI


    function nameOnchnage() {
        if (name.length < 3) {
            setisNameValid(false)
        } else {
            setisNameValid(true)
        }
    }

    const toast = useToast()
    const postDetails = async (pics) => {
        setPicLoading(true)
        if (pics === undefined) {
            toast({
                title: "Please select the image",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            return
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const formData = new FormData()
            formData.append('file', pics);
            formData.append('upload_preset', 'chat-app');
            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dfdmyewjs/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const data = await response.json();
                console.log(data)
                setPic(data.url.toString())
                setPicLoading(false)
            } catch (error) {
                console.log(error)
                setPicLoading(false)
            }
        } else {
            toast({
                title: "Please select the image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    async function submitHandler() {
        setPicLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the fields",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }

        if (password !== confirmPassword) {
            toast({
                title: "Both passwords must match",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }


        try {
            const { data } = await axios.post(`${apiUrl}/api/user/register`, {
                name, email, password, pic
            }, {
                withCredentials: true,
            })
            toast({
                title: "Loggedin Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })

            localStorage.setItem('userInfo', JSON.stringify(data.userCreated))
            setPicLoading(false)
            navigate('/chats')
        } catch (err) {
            setTimeout(() => {
                setPicLoading(false)
            }, 100);
            toast({
                title: err.response.data.message ? err.response.data.message : err.response.data,
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <VStack spacing='9px'>
            <form onSubmit={submitHandler}>
                <FormControl id='first-name' isRequired>
                    <FormLabel className=' text-xs'>Name</FormLabel>
                    <Input
                        h={'34px'}
                        className=''
                        placeholder='Enter Your Name'
                        onChange={(e) => {
                            setName(e.target.value);
                            nameOnchnage()
                        }}
                        value={name}
                    />
                    <div className='error'>
                        {isNameValid ? null : "Enter a valid name"}
                    </div>
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter Your Email'
                        color='black'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            pattern='/^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*\d).{5,}$/'
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                            value={password}
                            isInvalid={!isPasswordValid}
                        />
                        <InputRightElement width={'4.5rem'}>
                            <Button bg={'transparent'} h="1.75rem" size="sm" onClick={() => setShow((prev) => !prev)}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {isPasswordValid ? null : <Text fontSize='sm' className='text-xs font-medium'>password must contain digits, special characters and capital</Text>}
                </FormControl>

                <FormControl id='cnfrmpassword' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={cnfrmShow ? 'text' : 'password'}
                            placeholder='Enter Your password'
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                            }}
                            value={confirmPassword}
                        />
                        <InputRightElement width={'4.5rem'}>
                            <Button bg={'transparent'} h="1.75rem" size="sm" onClick={() => setCnfrmShow((prev) => !prev)}>
                                {cnfrmShow ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>Upload Your Image</FormLabel>
                    <Input
                        type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </FormControl>

                <Button
                    type='submit'
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={picLoading}
                >
                    Sign Up
                </Button>
            </form>
        </VStack>
    )
}

export default Signup
