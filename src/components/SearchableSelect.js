// import { Flex } from '@chakra-ui/react';
// // import {
// //   AutoComplete,
// //   AutoCompleteInput,
// //   AutoCompleteItem,
// //   AutoCompleteList,
// //   AutoCompleteCreatable,
// // } from '@choc-ui/chakra-autocomplete';

// const SearchableSelect = ({ value, setValues, companies }) => {
//   if (!companies) return null;
//   return (
//     <Flex justify="left" align="center" w="100%" mb="10px">
//       <AutoComplete
//         restoreOnBlur
//         openOnFocus
//         creatable
//         onChange={value => {
//           console.log(value);
//           setValues(prev => {
//             return { ...prev, company_name: value };
//           });
//         }}
//       >
//         <AutoCompleteInput
//           variant="filled"
//           // value={value}
//           // onChange={event => {
//           //   setValues(prev => {
//           //     return { ...prev, company_name: event.target.value };
//           //   });
//           // }}
//         />
//         <AutoCompleteList>
//           {companies.map(company => (
//             <AutoCompleteItem
//               key={company.id}
//               value={company.name}
//               textTransform="capitalize"
//             >
//               {company.name}
//             </AutoCompleteItem>
//           ))}
//           {/* <AutoCompleteCreatable>
//               {({ value }) => <span>Add {value} to List</span>}
//             </AutoCompleteCreatable> */}
//         </AutoCompleteList>
//       </AutoComplete>
//     </Flex>
//   );
// };

// export default SearchableSelect;
