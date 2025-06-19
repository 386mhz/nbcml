# HSTS Implementation Schedule

## Stage 1 - Initial Deployment
- Duration: 1 week
- max-age: 3600 (1 hour)
- Monitor for issues
- Check SSL certificate validity

## Stage 2 - Add includeSubDomains
- Duration: 3 weeks
- max-age: 86400 (1 day)
- Add includeSubDomains directive
- Verify all subdomains have valid SSL

## Stage 3 - Increase Duration
- Duration: 2 months
- max-age: 604800 (1 week)
- Continue monitoring
- Prepare for preload list submission

## Stage 4 - Full Implementation
- max-age: 31536000 (1 year)
- Include preload directive
- Submit to HSTS preload list
- https://hstspreload.org/

## Monitoring Checklist
- [ ] SSL certificate valid
- [ ] All subdomains secured
- [ ] No mixed content warnings
- [ ] Security headers present
- [ ] No HSTS-related errors