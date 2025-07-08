using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        #region Context Related Members
        /// <summary>
        /// Saves changes to the database
        /// </summary>
        void Save();
        #endregion

        #region Cached Repository Instances Members
        /// <summary>
        /// Gets a repository for a specific DBEntity (DBModel Entity)
        /// </summary>
        /// <typeparam name="TEntityType">The entity type the repositoty relates to</typeparam>
        /// <returns>A repository instance</returns>
        IRepository<TEntityType> Repo<TEntityType>() where TEntityType : class;

        #endregion
    }
    public class UnitOfWork : IUnitOfWork
    {
        private DatabaseContext _context;

        public UnitOfWork(DatabaseContext context)
        {
            _context = context;
        }

        private DatabaseContext Context
        {
            get
            {
                if (_context == null) _context = new DatabaseContext();
                return _context;
            }
            set => this._context = value;
        }

        public void Save()
        {
            try
            {
                if (this._context != null) Context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                //TODO WB what to log here?
                //Debug.WriteLine("{0}{1}Validation errors:{1}{2}", ex, Environment.NewLine,
                //    ex.EntityValidationErrors.Select(e => string.Join(Environment.NewLine,
                //        e.ValidationErrors.Select(v => string.Format("{0} - {1}", v.PropertyName, v.ErrorMessage)))));
                throw;
            }
            catch (DbUpdateException ex)
            {
                //TODO WB what to log here?
                //Debug.WriteLine("{0}{1}Validation errors:{1}{2}", ex, Environment.NewLine,
                //    ex.Entries.Select(e => string.Join(Environment.NewLine,
                //        e.ValidationErrors.Select(v => string.Format("{0} - {1}", v.PropertyName, v.ErrorMessage)))));
                throw;
            }
            catch (Exception ex)
            {
                //TODO WB what to log here?
                throw;
            }
        }

        private Dictionary<Type, object> Repositories { get; set; } = new Dictionary<Type, object>();

        public IRepository<TEntityType> Repo<TEntityType>() where TEntityType : class
        {
            Type key = typeof(TEntityType);
            if (!this.Repositories.ContainsKey(key))
            {
                Type repositoryType = typeof(Repository<>).MakeGenericType(key);
                object repositoryInstance = Activator.CreateInstance(repositoryType, this.Context);
                this.Repositories.Add(key, repositoryInstance);
            }
            return (IRepository<TEntityType>)this.Repositories[key];
        }

        #region IDisposable Members
        private bool _disposed;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    Context.Dispose();
                    Repositories = null;
                }
            }
            _disposed = true;
        }
        #endregion
    }
}
