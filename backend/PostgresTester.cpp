#include ".\external\postgres\include\libpq-fe.h"
#include <iostream>
#include <string>
using namespace std;

static void exit_nicely(PGconn *conn, PGresult   *res) {
	PQclear(res);
	PQfinish(conn);
	system("pause");
	exit(1);
}


int run() {
	PGconn *conn;
	conn = PQconnectdb("host = 'localhost' dbname = 'huevos_ranchero' user = 'postgres' password = 'denveromlette'");

	if (PQstatus(conn) == CONNECTION_BAD) {
		cout << "Connection failed, make sure you have initialized a database huevos_ranchero locally and have the right password!\n";
		system("pause");
		fprintf(stderr, "Connection to database failed: %s", PQerrorMessage(conn));
		PQfinish(conn);
		exit(1);
	}

	cout << "Connection succesful!\n";

	PGresult *result;

	// Creating Table Users
	cout << "Attempting to insert to userdata table . . . \n";
	string user_table_query = "INSERT INTO userdata (username, password, first_name, last_name, last_login, last_ip) VALUES ('chazman','poachedegg','chaz','acheronti','Tu Nov 7 2017 20:46:43 GMT-0700 (Pacific Daylight Time)','::1');";
	result = PQexec(conn, user_table_query.c_str());

	if (PQresultStatus(result) != PGRES_COMMAND_OK) {
		cout << "Make sure that the userdata table has been created witht he psql file!\n";
		fprintf(stderr, "INSERT failed: %s", PQerrorMessage(conn));
		exit_nicely(conn, result);
	}

	PQclear(result);

	system("pause");
}