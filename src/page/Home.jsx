import { Container, Heading, Tab, TabPanels, TabPanel, Text, TabList, Tabs } from '@chakra-ui/react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        if (userInfo) {
            navigate('/chats')
        }
    }, [navigate])

    return (
        <div className="home">
            <div className=''>
                <Container maxW='xl' borderRadius="lg" className='glass-effect py-3' centerContent>
                    <Tabs w="80%" className='my-4' isFitted variant='soft-rounded' colorScheme='blue'>
                        <TabList>
                            <Tab width='50%'>Login</Tab>
                            <Tab width='50%'>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel className='mx-3'>
                                <p><Login navigate={navigate} /></p>
                            </TabPanel>
                            <TabPanel>
                                <p><Signup /></p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Container>
            </div>
        </div>
    )
}

export default Home
