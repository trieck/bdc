#!/usr/bin/ruby

require 'cgi'
require 'mysql'
require 'json'

cgi = CGI::new
status = 'OK'
results = []

begin
  conn = Mysql::new '127.0.0.1', 'mqrieckc_bdc', '3rsk!n31', 'mqrieckc_bdc'

  rs = conn.query('select name, updated_at from machines order by updated_at desc')
  rs.each_hash do |result|
    results << {name: result['name'], date: result['updated_at']}
  end

rescue Mysql::Error
  status = 'SERVER_ERROR'
ensure
  conn.close unless conn.nil?
  cgi.out(
      'type' => 'application/json',
      'status' => status
  ) { JSON.generate({machines: results}) }
end


