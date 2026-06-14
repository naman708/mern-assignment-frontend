import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import UserCard from '../components/UserCard'
import Spinner from '../components/Spinner'
import { listUsers, deleteUser } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { pickList, errorMessage } from '../utils/apiData'

const LIMIT = 9

export default function UsersListPage() {
  const { user: me } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await listUsers({ page, limit: LIMIT, search })
      setData(pickList(resp))
    } catch (err) {
      setError(errorMessage(err, 'Failed to load users'))
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (value) => {
    setPage(1) // reset to first page on a new search
    setSearch(value)
  }

  const handleDelete = async (target) => {
    if (!window.confirm(`Delete ${target.name}? This cannot be undone.`)) return
    setDeletingId(target.id)
    try {
      await deleteUser(target.id)
      toast.success(`${target.name} deleted`)
      // If we removed the last item on a page, step back a page.
      if (data.items.length === 1 && page > 1) setPage((p) => p - 1)
      else fetchUsers()
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete user'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500">
            {data.total} {data.total === 1 ? 'user' : 'users'} registered
          </p>
        </div>
        <div className="w-full sm:max-w-xs">
          <SearchBar onSearch={handleSearch} initialValue={search} />
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading users…" />
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={fetchUsers} className="btn-secondary mt-4">Retry</button>
        </div>
      ) : data.items.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <p className="text-sm">No users found{search ? ` for “${search}”` : ''}.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                isOwnProfile={u.id === me?.id}
                deleting={deletingId === u.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="mt-8">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}
