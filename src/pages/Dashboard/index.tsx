import React, { useState, useEffect, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

import logo from '../../assets/logo.svg'
import api from '../../services/api'

import { Title, Form, Repositories, Error } from './styles'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashbaord: React.FC = () => {
  const [repository, setRepository] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const repositoriesStoreged = localStorage.getItem('@GithubExplorer:repositories')

    return repositoriesStoreged
      ? JSON.parse(repositoriesStoreged)
      : []
  })

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
  }, [repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!repository) {
      setInputError('Type the repository name')
      return
    }

    await api.get<Repository>(`repos/${repository}`)
      .then(response => {
        const _repository = response.data
    
        setRepositories([ ...repositories, _repository ])
        setRepository('')
        setInputError('')
      }).catch(error => {
        const { data } = error.response
        setInputError(data.message)
      })
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositories on Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={repository}
          onChange={e => setRepository(e.target.value)}
          placeholder="Repository name ex: facebook/react-native"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashbaord
