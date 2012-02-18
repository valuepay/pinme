#!/usr/bin/python
import re
import StringIO
import pycurl

fetch_timeout_secs=30

def download_file(src, output_file_path, post_fields_count=0, post_fields=None):
    output_file = open(output_file_path,"wb")
#    page_buffer = StringIO.StringIO()
    curl_conn = pycurl.Curl()
    curl_conn.setopt(pycurl.NOSIGNAL, 1)
    curl_conn.setopt(pycurl.FOLLOWLOCATION, 1)
    curl_conn.setopt(pycurl.MAXREDIRS, 5)
    curl_conn.setopt(pycurl.TIMEOUT,fetch_timeout_secs)
    curl_conn.setopt(pycurl.URL, str(src))
    curl_conn.setopt(pycurl.USERAGENT, "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.186 Safari/535.1")
    curl_conn.setopt(pycurl.SSL_VERIFYHOST, False)
    curl_conn.setopt(pycurl.SSL_VERIFYPEER, False)
    curl_conn.setopt(pycurl.SSLVERSION, pycurl.SSLVERSION_SSLv3)
#    curl_conn.setopt(pycurl.PROXY , '192.168.56.101:8888')
    curl_conn.setopt(pycurl.WRITEFUNCTION, output_file.write )
    
    # post data if needed
#    if post_fields!=None:
#        curl_conn.setopt(pycurl.POST,post_fields_count);
#        curl_conn.setopt(pycurl.POSTFIELDS,post_fields);
    
    try:
        curl_conn.perform()
    except:
        output_file.close()
        return 1
    else:
        output_file.close()
        return 0 
    
if __name__ == "__main__":
    print "It's not an executable file"