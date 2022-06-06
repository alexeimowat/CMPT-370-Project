import psycopg2

try:
    conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost' password='docker'")
except:
    print("I am unable to connect to the database")
    exit(1)

cur = conn.cursor()
print( "all is well")

