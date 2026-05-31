import { describe, it, expect } from 'vitest';
import { parseInvoice } from './invoices';

describe('BOLT12 Support', () => {
  describe('BOLT12 Offer Decoding', () => {
    it('should decode a valid BOLT12 offer', async () => {
      const offer = 'lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q42xjurnyyfqys2zzcssx06thlxk00g0epvynxff5vj46p3en8hz8ax9uy4ckyyfuyet8eqg';
      
      const result = await parseInvoice(offer);
      
      expect(result).toBeDefined();
      expect(result.isBOLT12).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.type).toBe('offer');
      expect(result.data.id).toBe('45880e501c65e9060d33128d2de1d23ff52ae768b2bcb62bef262d90b741b8cd');
      expect(result.data.description).toBe('Tips!');
      expect(result.data.issuer).toBe('AB');
      expect(result.data.issuerId).toBe('033f4bbfcd67bd0fc858499929a3255d063999ee23f4c5e12b8b1089e132b3e408');
      expect(result.data.chains).toBeDefined();
      expect(Array.isArray(result.data.chains)).toBe(true);
    });

    it('should handle BOLT12 offer with lightning: prefix', async () => {
      const offer = 'lightning:lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q42xjurnyyfqys2zzcssx06thlxk00g0epvynxff5vj46p3en8hz8ax9uy4ckyyfuyet8eqg';
      
      const result = await parseInvoice(offer);
      
      expect(result).toBeDefined();
      expect(result.isBOLT12).toBe(true);
      expect(result.data.type).toBe('offer');
    });

    it('should handle BOLT12 offer with lightning= parameter', async () => {
      const offer = 'https://example.com/pay?lightning=lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q42xjurnyyfqys2zzcssx06thlxk00g0epvynxff5vj46p3en8hz8ax9uy4ckyyfuyet8eqg';
      
      const result = await parseInvoice(offer);
      
      expect(result).toBeDefined();
      expect(result.isBOLT12).toBe(true);
      expect(result.data.type).toBe('offer');
    });
  });

  describe('BOLT12 Invoice Decoding', () => {
    it('should decode a valid BOLT12 invoice', async () => {
      const invoice = 'lni1qqgqp9et744ne2r7zg3kq0vz860xgyxvqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glc7qsp2dxt6avc2avfxg2avl58psv7xflwzhfmv2gtm9wytkn5c7uusvpq9qr8h0nh66qpv7xa9hyguuc3ar3y42qlxsxcy0genwt8d7tsamvaqqeec63yjlkyyd05gkfzrwwvaxl8y9jjxemwsqrnc2j6xdjrg0yzj7k5x2pwvyga3heejhra24a0wushp6rfqq3jdf2glnwaydeml333v4xrap92ek3q9qgm7370exxs45f68p42sqqpqrslyuarpkn5r78nquzma65rrs6jqvqcdgzcyypdf0d2vqmqu02ruex9mskrzmr5d3rrzygttq425w89c3z3arqh8f9ql5qe5quxfmcztl0gldv8mxy3sm8x5jscdz27u39fy6luxu8zcdn9j73l3uppfjclju37sq4pfcne5gw9l9vydpsnfwlnkc0f2ncu786mxzpss0szqfhylpxyl0pjvnwheheful2mjtu0zvvnfwmrkzm7e5flnh5dmpmxzqz998um6nckle0n2sse3lad2cm2m87wqssjn8rtrstgw7fr4cq7jcss3aspnmgg2sua776240454kl9f5sv9t3cfe58xur7mch6q9rz6u4sdffra2cz7nwvw2xcmty0eut4dayy03n6guksvrvtt237tl6264ks8yyfhqjspn9uj9zg4wrhpsvrw56skaqcfd3ul6d6tlpw3qrz5jnuz609ee7czc6n629rm5ccncackrspca3mpzk4phrjwcc9hukuxck2u93wkpmp0hx8rn2c7pd65hsl8hwkzqemkx7p2g0zkx92gzvyg5cfpktvm42g57d6spjy7clkwtrtz72pmm4a990phfa3exzldwsydqxpq3tepwk5v9474zmmd98ttyyzx058t2sf5dvpn73hlvdhnycv55t4lsv6a9080a83dl9s7mf02ukt48nhche6he45j9npx87jk7eyhzxsrjpzz0t5e2n206an9ma59uhatgsuqqqq86qqqqqxgq9zqqqqqqqqqqp7sqqqqqqqqqcdgqqqpfqyvm5xhjdxqy72sg8wkseztv2dpeudmcx0ahz6ezxx86thwrzvjfq400rnhh7vmcrs6k4qxqvx5zhqxqsqqzczzq3jdf2glnwaydeml333v4xrap92ek3q9qgm7370exxs45f68p42srcyql379vw777n9rmj66ze9qmq8agvuz9fdg6nnu5wcdn6ppvrh3rjcftld8rtakadngfdalgq9czau46yfa07pqpeffqlx8qaruzv7w5qs';
      
      const result = await parseInvoice(invoice);
      
      expect(result).toBeDefined();
      expect(result.isBOLT12).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.type).toBe('invoice');
      expect(result.data.id).toBe('4f80127354452142ca241c0964b65632d4f6209e9376f1d968e372ef0d1b6dfe');
      expect(result.data.amount).toBe('100000');
      expect(result.data.payerId).toBe('02d4bdaa60360e3d43e64c5dc2c316c746c4631110b582aaa38e5c4451e8c173a4');
      expect(result.data.paymentHash).toBe('eeb43225b14d0e78dde0cfedc5ac88c63e97770c4c924157bc73bdfccde070d5');
      expect(result.data.nodeId).toBe('02326a548fcddd2373bfc631654c3e84aacda202811bf47cfc98d0ad13a386aa80');
      expect(result.data.paths).toBeDefined();
      expect(Array.isArray(result.data.paths)).toBe(true);
      expect(result.data.blindedPayInfo).toBeDefined();
      expect(Array.isArray(result.data.blindedPayInfo)).toBe(true);
    });

    it('should handle BOLT12 invoice with lightning: prefix', async () => {
      const invoice = 'lightning:lni1qqgqp9et744ne2r7zg3kq0vz860xgyxvqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glc7qsp2dxt6avc2avfxg2avl58psv7xflwzhfmv2gtm9wytkn5c7uusvpq9qr8h0nh66qpv7xa9hyguuc3ar3y42qlxsxcy0genwt8d7tsamvaqqeec63yjlkyyd05gkfzrwwvaxl8y9jjxemwsqrnc2j6xdjrg0yzj7k5x2pwvyga3heejhra24a0wushp6rfqq3jdf2glnwaydeml333v4xrap92ek3q9qgm7370exxs45f68p42sqqpqrslyuarpkn5r78nquzma65rrs6jqvqcdgzcyypdf0d2vqmqu02ruex9mskrzmr5d3rrzygttq425w89c3z3arqh8f9ql5qe5quxfmcztl0gldv8mxy3sm8x5jscdz27u39fy6luxu8zcdn9j73l3uppfjclju37sq4pfcne5gw9l9vydpsnfwlnkc0f2ncu786mxzpss0szqfhylpxyl0pjvnwheheful2mjtu0zvvnfwmrkzm7e5flnh5dmpmxzqz998um6nckle0n2sse3lad2cm2m87wqssjn8rtrstgw7fr4cq7jcss3aspnmgg2sua776240454kl9f5sv9t3cfe58xur7mch6q9rz6u4sdffra2cz7nwvw2xcmty0eut4dayy03n6guksvrvtt237tl6264ks8yyfhqjspn9uj9zg4wrhpsvrw56skaqcfd3ul6d6tlpw3qrz5jnuz609ee7czc6n629rm5ccncackrspca3mpzk4phrjwcc9hukuxck2u93wkpmp0hx8rn2c7pd65hsl8hwkzqemkx7p2g0zkx92gzvyg5cfpktvm42g57d6spjy7clkwtrtz72pmm4a990phfa3exzldwsydqxpq3tepwk5v9474zmmd98ttyyzx058t2sf5dvpn73hlvdhnycv55t4lsv6a9080a83dl9s7mf02ukt48nhche6he45j9npx87jk7eyhzxsrjpzz0t5e2n206an9ma59uhatgsuqqqq86qqqqqxgq9zqqqqqqqqqqp7sqqqqqqqqqcdgqqqpfqyvm5xhjdxqy72sg8wkseztv2dpeudmcx0ahz6ezxx86thwrzvjfq400rnhh7vmcrs6k4qxqvx5zhqxqsqqzczzq3jdf2glnwaydeml333v4xrap92ek3q9qgm7370exxs45f68p42srcyql379vw777n9rmj66ze9qmq8agvuz9fdg6nnu5wcdn6ppvrh3rjcftld8rtakadngfdalgq9czau46yfa07pqpeffqlx8qaruzv7w5qs';
      
      const result = await parseInvoice(invoice);
      
      expect(result).toBeDefined();
      expect(result.isBOLT12).toBe(true);
      expect(result.data.type).toBe('invoice');
    });
  });

  describe('BOLT12 Error Handling', () => {
    it('should return null for invalid BOLT12 string', async () => {
      const invalidBolt12 = 'lno1invalidstring';
      
      const result = await parseInvoice(invalidBolt12);
      
      // Should return null or an error object
      expect(result === null || result.data === null).toBe(true);
    });

    it('should return null for empty string', async () => {
      const result = await parseInvoice('');
      expect(result).toBeNull();
    });

    it('should return null for null input', async () => {
      const result = await parseInvoice(null);
      expect(result).toBeNull();
    });
  });

  describe('BOLT12 Integration', () => {
    it('should prioritize BOLT12 over BOLT11 when both prefixes match', async () => {
      // This tests that lno1, lni1, lnr1 are checked before lnbc/lntb
      const offer = 'lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q42xjurnyyfqys2zzcssx06thlxk00g0epvynxff5vj46p3en8hz8ax9uy4ckyyfuyet8eqg';
      
      const result = await parseInvoice(offer);
      
      expect(result.isBOLT12).toBe(true);
      expect(result.isLNURL).toBe(false);
    });

    it('should not confuse BOLT12 with LNURL', async () => {
      const offer = 'lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q42xjurnyyfqys2zzcssx06thlxk00g0epvynxff5vj46p3en8hz8ax9uy4ckyyfuyet8eqg';
      
      const result = await parseInvoice(offer);
      
      expect(result.isBOLT12).toBe(true);
      expect(result.isLNURL).toBeFalsy();
    });
  });
});
