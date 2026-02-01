import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dog Information RAG System</title>
        <meta name="description" content="Ask questions about dog breeds" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          🐕 Dog Information Assistant
        </h1>

        <p className={styles.description}>
          Ask me anything about dog breeds using AI-powered retrieval!
        </p>

        <ChatInterface />
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by RAG (Retrieval Augmented Generation) | Data from{' '}
          <a href="https://dog.ceo/dog-api/" target="_blank" rel="noopener noreferrer">
            Dog CEO API
          </a>
        </p>
      </footer>
    </div>
  );
}
