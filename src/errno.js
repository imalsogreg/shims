#include "HsBaseConfig.h"

#ifdef GHCJS_TRACE_ERRNO
function h$logErrno() { h$log.apply(h$log,arguments); }
#define TRACE_ERRNO(args...) h$logErrno(args)
#else
#define TRACE_ERRNO(args...)
#endif

var h$errno = 0;

function h$__hscore_get_errno() {
  TRACE_ERRNO("hscore_get_errno: " + h$errno);
  return h$errno;
}

function h$setErrno(e) {
  TRACE_ERRNO("setErrno: " + e);
  var es = e.toString();
  var getErr = function() {
      if(es.indexOf('ENOTDIR') !== -1)      return CONST_ENOTDIR;
      if(es.indexOf('ENOENT') !== -1)       return CONST_ENOENT;
      if(es.indexOf('EEXIST') !== -1)       return CONST_EEXIST;
      if(es.indexOf('ENETUNREACH') !== -1)  return CONST_EINVAL; // fixme
      if(es.indexOf('EPERM') !== -1)        return CONST_EPERM;
      if(es.indexOf('EMFILE') !== -1)       return CONST_EMFILE;
      if(es.indexOf('EPIPE') !== -1)        return CONST_EPIPE;
      if(es.indexOf('Bad argument') !== -1) return CONST_ENOENT; // fixme?
      throw ("setErrno not yet implemented: " + e);

  }
  h$errno = getErr();
}

var h$errorStrs =  { CONST_E2BIG:   "too big"
                   , CONST_EACCESS: "no access"
                   , CONST_EINVAL:  "invalid"
                   , CONST_EBADF:   "bad file descriptor"
                   , CONST_ENOTDIR: "not a directory"
                   , CONST_ENOENT:  "no such file or directory"
                   , CONST_EPERM:   "operation not permitted"
                   , CONST_EEXIST:  "file exists"
                   , CONST_EMFILE:  "too many open files"
                   , CONST_EPIPE:   "broken pipe"
                   }

function h$strerror(err) {
    TRACE_ERRNO("strerror: " + err);
    h$ret1 = 0;
    return h$encodeUtf8(h$errorStrs[err] || "unknown error");
}

function h$handleErrno(r_err, f) {
  try {
    return f();
  } catch(e) {
    h$setErrno(e);
    return r_err;
  }
}

function h$handleErrnoS(r_err, r_success, f) {
  try {
    f();
    return r_success;
  } catch(e) {
    h$setErrno(e);
    return r_err;
  }
}

function h$handleErrnoC(err, r_err, r_success, c) {
    if(err) {
        h$setErrno(err);
        c(r_err);
    } else {
        c(r_success);
    }
}
