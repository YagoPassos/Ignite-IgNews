import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa';


export function SignInButton() {

    const insUserLoggedIn = true;
    return (
        <>
            <button type='button'
                className={styles.signInButton}
            >
                <FaGithub color='#eba417' />
                Sign in with Github
            </button>
        </>
    )
}