using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Repository
{
    public interface IRepository<TEntity> where TEntity : class
    {
        void Insert(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);

        TEntity GetById(int id);
        TEntity GetById(Guid id);

        Task<TEntity> GetByIdAsync(int id);
        Task<TEntity> GetByIdAsync(Guid id);

        //So you do this
        //TEntity Find(params object[] keys);
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>,
                IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = ""
        );

        //Might as well add this as well.
        //IQueryable<TEntity> Query { get; }
    }

    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {

        private DatabaseContext Context { get; set; }

        private DbSet<TEntity> Set => Context.Set<TEntity>();

        public Repository(DatabaseContext dbContext)
        {
            Context = dbContext;
        }

        public IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = Set.AsNoTracking();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }
            else
            {
                return query;
            }
        }

        public TEntity GetById(int id)
        {
            return Set.Find(id);
        }

        public TEntity GetById(Guid id)
        {
            return Set.Find(id);
        }

        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await Set.FindAsync(id);
        }

        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            return await Set.FindAsync(id);
        }

        public IQueryable<TEntity> Query => Set;

        public TEntity Find(params object[] keys)
        {
            return Set.Find(keys);
        }

        public void Insert(TEntity entity)
        {
            var entry = Context.Entry(entity);
            if (entry.State == EntityState.Detached)
                Set.Add(entity);
        }

        public void Delete(TEntity entity)
        {
            var entry = Context.Entry(entity);
            if (entry.State == EntityState.Detached)
                Set.Attach(entity);
            Set.Remove(entity);
        }

        public void Update(TEntity entity)
        {
            var entry = Context.Entry(entity);
            if (entry.State == EntityState.Detached)
                Set.Attach(entity);
            entry.State = EntityState.Modified;
        }
    }
}
