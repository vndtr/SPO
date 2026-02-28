import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import ProfileCard from '../components/profileComps/profileCard.jsx';

export default function ProfileView() {
  return (
    <>
      <Header/>
      <div className='flex'>
        <NavAside/>
        <div className='bg-beige-1 flex text-accent-2 w-screen p-10'>
          <div className='flex-3 text-blue'>
            <h1 className='text-3xl mb-6'>Профиль</h1>
            <ProfileCard/>
          </div>
        </div>
      </div>
    </>
  );
}