using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace MessageAPI.Helpers
{
    public class DbProvider
    {
        #region properties/fields
        public static string ConnectionString { get; set; }
        public SqlConnection Connection { get; set; }
        #endregion

        #region ctor
        public DbProvider() : this(null) { }
        public DbProvider(string connectionString)
        {
            if (!String.IsNullOrWhiteSpace(connectionString))
                SetConnectionString(connectionString);

            if (String.IsNullOrWhiteSpace(ConnectionString))
                throw new Exception("No connection string.");

            this.Connection = new SqlConnection(ConnectionString);
        }
        #endregion

        #region static methods
        public static void SetConnectionString(string connectionString)
        {
            if (String.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentException("Paremeter cannot be null or empty.", "connectionString");

            ConnectionString = connectionString;
        }

        public static SqlConnection GetSqlConnection(string connectionString = null)
        {
            return !string.IsNullOrWhiteSpace(connectionString) ? new DbProvider(ConnectionString).Connection : new DbProvider().Connection;
        }
        #endregion

        #region methods
        public void Dispose()
        {
            Connection = null;
        }
        #endregion
    }
}
