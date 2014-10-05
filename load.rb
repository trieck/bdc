#!/Ruby21-x64/bin/ruby

require 'cgi'
require 'mysql'
require 'json'

cgi = CGI::new
status = 'OK'
record = {}

begin
  conn = Mysql::new '127.0.0.1', 'mqrieckc_bdc', '3rsk!n31', 'mqrieckc_bdc'

  name = Mysql.escape_string(cgi['name'])
  rs = conn.query("select data from machines where name='#{name}';")
  row = rs.fetch_hash
  unless row
    raise Mysql::ClientError, 'No results'
  end

  record = JSON.parse(row['data'])

rescue Mysql::Error
  status = 'SERVER_ERROR'
ensure
  conn.close
  cgi.out(
      'type' => 'application/json',
      'status' => status
  ) { JSON.generate(record) }
end


