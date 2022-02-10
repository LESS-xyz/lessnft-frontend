import axios from '../../core/axios';

export default {
  getAllNetworks: () => axios.get('/networks/'),
};
