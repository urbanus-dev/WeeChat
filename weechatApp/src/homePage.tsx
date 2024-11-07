import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
  return (
<div className="min-h-screen flex flex-col justify-center">
      <nav className="flex bg-green-600 w-full h-36 gap-10 justify-between items-center p-4">
        <ul className="flex gap-8 mt-auto">
          <li>
            <a href="#home" className="text-white hover:text-gray-300 transition duration-300 text-2xl">Home</a>
          </li>
          <li>
            <a href="#chats" className="text-white hover:text-gray-300 transition duration-300 text-2xl">Chats</a>
          </li>
          <li>
            <a href="#contacts" className="text-white hover:text-gray-300 transition duration-300 text-2xl">Contacts</a>
          </li>
          <li>
            <a href="#settings" className="text-white hover:text-gray-300 transition duration-300 text-2xl">Settings</a>
          </li>
        </ul>
        <div className="flex gap-4">
          <button className="w-40 h-14 bg-white text-blue-950 py-2 rounded-md hover:bg-orange-400 transition duration-300 mt-auto mb-2"
           onClick={()=>navigate('/register')}>
            Register
          
          </button>
          <button className="w-40 h-14 bg-white text-blue-950 py-2 rounded-md hover:bg-orange-400 transition duration-300 mt-auto mb-2"
             onClick={()=>navigate('/login')} 
             >
            Login
          </button>
        </div>
      </nav>
      <header className="bg-blue-950 text-white text-center p-10 ">
        <h1 className="text-4xl font-bold">Welcome to WeeChat</h1>
        <p className="text-xl mt-4">Connect with your friends and family instantly</p>
      </header>
      
      <main className="flex-grow p-8">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside">
            <li className="text-xl mb-2">Real-time messaging</li>
            <li className="text-xl mb-2">Group chats</li>
            <li className="text-xl mb-2">Automated Text Translation</li>
            <li className="text-xl mb-2">Customizable profiles</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4">Get Started</h2>
          <p className="text-xl">Sign up now to start chatting with your friends and family.</p>
        </section>
      </main>
      
      <footer className="bg-green-600 text-white text-center py-4">
        <p>&copy; 2024 WeeChat. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#privacy" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-300">Terms of Service</a>
          <a href="#contact" className="hover:text-gray-300">Contact Us</a>
        </div>
      </footer>
    </div>
  )
}

export default HomePage 